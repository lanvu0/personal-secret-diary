

function getDashboardPage(req, res) {

  res.render('pages/dashboard', { userId: req.session.userId} );

}

export default {
  getDashboardPage
}