const healthCheck = (req, res) => {
    res.status(200);
    res.send('Server is running...')
}

export default healthCheck;