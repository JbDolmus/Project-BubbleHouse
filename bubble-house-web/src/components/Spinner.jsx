
export default function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="relative flex space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0s' }}></div>
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );
}
