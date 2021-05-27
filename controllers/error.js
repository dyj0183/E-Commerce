exports.get404Error = (req, res, next) => {
    // since we already use "app.set" to tell where to find the template engine, here we can 
    // use use '404', we can then pass javascript object 
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
    });

    // this is old, we are using template engine now, so don't need this anymore
    // res.sendFile(path.join(__dirname, 'views', '404.html'));
}