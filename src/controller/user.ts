import e, {NextFunction, Request, Response} from 'express';
import BaseClass from './baseController';
import {UserData} from '../modals/auth.modal';
import Encryption from '../utils/commonFunctions/Encryption';
import {createToken} from '../services/middleware/session.middleware';
import {
  emailVerification,
  formatEmail,
  updateTokeniv,
} from '../utils/commonFunctions/commonFunctions';
import {v4 as uuidv4} from 'uuid';
import {sendErrorResponse} from '../utils/commonFunctions/errorHandler';

class UserClass extends BaseClass {
  async userSignUp(req: Request, res: Response) {
    try {
      let {name, email, password, employeeId, accountType, companyName} =
        req.body;
      if (accountType == 1) {
        if (!employeeId) {
          res.status(400).json({
            message: 'Employee Id Required',
          });
        }
      }
      let newEmail = formatEmail(email);
      let dbResponse = await UserData.findOne({
        $or: [{email: newEmail}, {employeeId: employeeId}],
      });
      if (!dbResponse) {
        const emailValid = await emailVerification(newEmail);
        if (!emailValid.valid) {
          res.status(400).json({
            statusCode: 400,
            message: 'Email is not valid',
          });
        }
        let hashPassword: any = await Encryption.HashEncryption(password);
        const userId = uuidv4();
        let authToken = Encryption.Encrypt(await createToken(req, res, userId));

        const user = new UserData({
          userId,
          name,
          email: newEmail,
          password: hashPassword,
          employeeId,
          accountType,
          companyName,
          tokeniv: authToken.iv,
          emailVerified: false,
        });
        await user.save();
        const resp = {
          name,
          email: newEmail,
          employeeId,
          accountType,
          companyName,
          userId,
          emailVerified: user.emailVerified,
          authToken: authToken.encryptedData,
        };

        res.status(200).json({
          statusCode: 200,
          message: 'Signedup Successfully',
          data: {...resp},
        });
      } else {
        res.status(400).json({
          statusCode: 400,
          message: 'User Already Exists with the same Email or EmployeeId',
        });
      }
    } catch (error) {
      sendErrorResponse(error);
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      let {email, password} = req.body;
      let newEmail = formatEmail(email);
      const resp = await UserData.findOne({email: newEmail});
      if (resp) {
        let decryptPass = await Encryption.HashCompare(
          password,
          resp?.password,
        );
        if (decryptPass) {
          const authToken = Encryption.Encrypt(await createToken(req, res));
          updateTokeniv(UserData, resp?._id, authToken.iv);
          const {
            userId,
            name,
            email,
            employeeId,
            accountType,
            companyName,
            emailVerified,
          } = resp;
          const responseData = {
            userId,
            name,
            email,
            employeeId,
            accountType,
            companyName,
            emailVerified,
          };
          res.status(200).json({
            successCode: 200,
            data: {
              data: responseData,
              authToken: authToken.encryptedData,
            },
          });
        } else {
          res.status(400).json({
            successCode: 400,
            message: 'Incorrect Password',
          });
        }
      } else {
        res.status(400).json({
          successCode: 400,
          message: `User doesn't Exists`,
        });
      }
    } catch (error) {
      sendErrorResponse(error);
    }
  }

  // async verifyOtp(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const {otp} = req.body;
  //   } catch (error) {}
  // }
}

export default new UserClass();
