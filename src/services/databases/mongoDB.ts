import mongoose from 'mongoose';

import {Config, SYS_ERR} from '../../utils/commonFunctions/index';

class Mongo {
  /**
   * connects to the mongo database
   * @param uri - the new version of mongodb connection string
   */
  async connectDatabase(uri: string) {
    mongoose.connect(uri, {}).then(
      () => {
        console.log(`SUCCESS: database connected to "${uri}"`);
      },
      err => {
        console.log(`ERROR: database failed to connect "${uri}"`);

        console.log('ERROR: ', err);

        process.exit(SYS_ERR.MONGO_CONN_FAILED);
      },
    );

    // if (process.env.NODE_ENV !== Config.PRODUCTION) mongoose.set('debug', true);
    // mongoose.set('debug', true);
  }
}

export const mongoDOA = new Mongo();
