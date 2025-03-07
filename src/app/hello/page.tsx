const HelloPage = async () => {
    try {
        const response = await fetch(`${process.env.API_URL}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return (
            <div>
                <h1>API Response</h1>
                <pre>{JSON.stringify(result)}</pre>
            </div>
        );
    } catch (error) {
        return (
            <div>
                <h1>Error</h1>
                <pre>{JSON.stringify(error)}</pre>
            </div>
        );
    }
};

export default HelloPage;
