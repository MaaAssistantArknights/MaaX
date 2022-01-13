import path from 'path';
import { is } from 'electron-util';
import { Assistant, voidPointer } from '.';

export default () => {
  function cb(msg: number, detail: string, custom_arg: any) {
    console.log(msg);
    console.log(JSON.parse(detail));
  }

  const dllPath = is.development
    ? path.join(process.cwd(), 'assets')
    : path.join(process.resourcesPath, 'assets');

  const asst = new Assistant(dllPath);
  const ax = asst.CreateEx(cb, voidPointer());
  // asst.CatchDefault()
  if (asst.CatchCustom('127.0.0.1:5555')) {
    console.log('successfully connected');
    // asst.AppendMall(ax,true)
    // asst.AppendVisit(ax)
    // asst.AppendInfrast(ax,1,["Mfg","Trade"],2,"Money",0.3)
    // asst.AppendInfrast(ax,1,["Control"],1,"_NotUse",0.4)

    // asst.AppendRecruit(1, [3, 4, 5], 3, [3, 4, 5], 3, true);
    // asst.AppendAward(ax);

    // asst.StartRecruitCalc(ax,[4,5,6],3,true)
    // asst.Start(ax);
  } else {
    console.log('failed to connect');
  }
  asst.Destroy(ax);
};
