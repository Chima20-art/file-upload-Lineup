import { useEffect, useState } from 'react'
import axios from 'axios'
export default function Home() {
    const [showFolders, setShowFolders] = useState(false)
    const [file, setFile] = useState('')
    const [loaded, setLoaded] = useState(0)
    const [files, setFiles] = useState([])

    useEffect(() => {
        if (typeof window != 'undefined') {
            let oldFiles = JSON.parse(localStorage.getItem('files')) ?? []
            setFile(oldFiles)
        }
    }, [files])

    const onFileUpload = () => {
        const data = new FormData()
        data.append('file', file, file.name)
        axios
            .post('http://localhost:3001/upload', data, {
                onUploadProgress: (ProgressEvent) => {
                    console.log('test')
                    setLoaded(
                        (ProgressEvent.loaded / ProgressEvent.total) * 100
                    )
                },
            })
            .then((res) => {
                if (res.data.message == 'success') {
                    let file = {
                        fileName: res.data.fileName,
                        filePath: res.data.filePath,
                    }
                    let newFiles = [...files, file]
                    setFiles(newFiles)
                    if (typeof window != 'undefined') {
                        localStorage.setItem('files', JSON.stringify(newFiles))
                    }
                }
            })
    }

    return (
        <div>
            <div className="w-full h-screen bg-blue-400 flex items-center justify-center ">
                <div className="w-[400px] h-fit bg-white rounded-md py-8 px-4 text-center flex flex-col  ">
                    <h1 className="font-bold text-2xl mb-6">Upload</h1>
                    <p>Upload as many files as you like get a link to share.</p>

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="mt-12 w-[200px]  mx-auto "
                    />
                    <p className=" w-[200px] text-start mx-auto ">
                        or{' '}
                        <span
                            onClick={() => setShowFolders(!showFolders)}
                            href="url"
                            className="cursor-pointer text-blue-800 hover:underline"
                        >
                            see all files
                        </span>
                    </p>
                    <ul
                        className={'flex flex-col w-[200px] text-start mx-auto'}
                    >
                        {files.map((file) => {
                            return (
                                <li>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={file.filePath}
                                    >
                                        {file.fileName}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    <button
                        onClick={onFileUpload}
                        className="bg-blue-800 w-[100px] mx-auto py-2 px-3 rounded text-white my-4"
                    >
                        {' '}
                        Upload{' '}
                    </button>
                </div>
            </div>
        </div>
    )
}
