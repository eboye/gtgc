import { Datasource } from '../../server/datasource';

export const load = async () => {
  return {
    data: await Datasource.getMany('SELECT * FROM semantic_history LIMIT 5'),
  };
};

