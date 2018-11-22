require('dotenv').config();
const nodemailer = require('nodemailer');
const json2csv = require('json2csv').parse;
// const path = require('path');

const Email = require('../models/email');
const log = require('../utils/log')(module);

const fields = ['name', 'email', 'phoneNumber'];
const opts = { fields };

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.SENDEMAIL,
    pass: process.env.SENDMAILPASS,
  },
});

function postEmail(req, res) {
  const save = async () => {
    const email = new Email(req.body);
    await email.save((err, data) => {
      if (err) {
        return res.status(400).json({ err: 1, msg: 'Bad Request', error: err });
      }
      return res.status(200).json({ err: 0, msg: 'success', debug: data });
    });
  };
  save()
    .then(() => {
      const mailOptions = {
        from: process.env.SENDEMAIL,
        to: req.body.email,
        subject: 'Call-центр под ключ',
        text: `
          Здравствуйте, ${req.body.name}
          Спасибо, что оставили заявку на нашем сайте. В ближайшее время с Вами свяжется наш менеджер. 
          А пока предлагаем Вам ознакомиться с нашим коммерческим предложением и ценами на услуги. 
        `,
        attachments: [
          {
            filename: 'Коммерческое предложение.pdf',
            path: 'static/Коммерческое предложение.pdf',
            contentType: 'application/pdf',
          },
          {
            filename: 'Прайс-лист.pdf',
            path: 'static/Прайс-лист.pdf',
            contentType: 'application/pdf',
          },
        ],
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          log.error(error);
        } else {
          log.info(`Email sent: ${info.response}`);
          transporter.close();
        }
      });
    })
    .catch(exception => res.status(500).json({ err: 0, msg: 'Internal Error', error: exception.toString() }));
}

function getLeads(req, res) {
  const csvExport = async () => {
    const value = await Email.find({}, (err, data) => data);
    const csv = await json2csv(value, opts);
    return csv;
  };
  csvExport()
    .then((csv) => {
      res.setHeader('Content-disposition', 'attachment; filename=leads.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    })
    .catch((exception) => { res.status(500).json({ err: 1, msg: 'Internal Error', error: exception.toString() }); });
}

function renderIndex(req, res) {
  return res.status(200).render('index', {
    title: 'Auto Email Service',
  });
}

module.exports.postEmail = postEmail;
module.exports.getLeads = getLeads;
module.exports.renderIndex = renderIndex;
