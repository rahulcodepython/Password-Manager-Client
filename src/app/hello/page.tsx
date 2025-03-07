const HelloPage = async () => {
    return await fetch(process.env.API_URL!)
        .then(response => response.json())
        .then(data => {
            return <div>
                <h1>API Response</h1>
                <pre>{JSON.stringify(data)}</pre>
            </div>
        })
        .catch(error => {
            return <div>
                <h1>Error</h1>
                <pre>{JSON.stringify(error)}</pre>
            </div>
        });
};

export default HelloPage;
