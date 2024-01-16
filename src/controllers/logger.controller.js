const Test_logger = async (req, res) => {
    req.logger.fatal('fatal...');
    req.logger.debug('debug...');
    req.logger.http('http...');
    req.logger.warning('warning...');
    req.logger.error('error...');
    req.logger.info('info...');
};


export {
    Test_logger
}