const Task = ({taskno, description, dateupdated}) => {
    return(
        <>
            <div className="flex flex-col justify-start px-12 bg-[#2596be] w-[25rem] h-[15rem] bg-opacity-50">
                <h3>Task <span>3</span></h3>
                <div>
                    Description
                </div>
                <div className="py-4">
                    Created At: 
                </div>
            </div>

            
        </>
    )
}

export default Task;