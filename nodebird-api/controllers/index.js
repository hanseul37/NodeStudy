const { v4: uuidv4 } = require("uuid");
const { User, Domain } = require("../models");

exports.renderLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id || null }, //where에는 undefind가 되면 안됨!! 로그인이 안되어있으면 undefind가 나옴
      include: { model: Domain },
    });
    res.render("login", {
      user,
      domains: user?.Domains,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createDomain = async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
