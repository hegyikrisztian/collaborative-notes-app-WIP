

const NoteListSkeleton = () => {
    return (
        <>
            {Array(9).fill(0).map((_, i) => {
                return (
                    <div key={i} className="animate-pulse flex flex-col bg-gray-800 p-3.5 rounded-2xl shadow-2xl h-32 w-38 justify-end">
                        <div className="h-32 relative flex flex-col h-0.7">
                            <div className="mb-5 h-10 w-full bg-gray-600 rounded-2xl"></div>
                            <div className="text-gray-500 flex flex-row gap-1">
                                <div className="bg-gray-600 rounded-full w-5 h-5 p-0 m-0 leading-5 text-center text-white text-xs"></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
}
 
export default NoteListSkeleton;