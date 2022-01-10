import { Assistant, voidPointer } from './inferface';

function cb(msg: number, detail: string, custom_arg: any) {
  console.log(msg);
  console.log(JSON.parse(detail));
}

const asst = new Assistant(
  'C:\\Users\\bakashigure\\Desktop\\MeoAssistance_v2.5.0\\'
);
const ax = asst.CreateEx(cb, voidPointer());
// asst.CatchDefault()
if (asst.CatchCustom('127.0.0.1:5555')) {
  console.log('连接成功');
} else {
  console.log('连接失败');
}
// asst.AppendMall(ax,true)
// asst.AppendVisit(ax)
// asst.AppendInfrast(ax,1,["Mfg","Trade"],2,"Money",0.3)
// asst.AppendInfrast(ax,1,["Control"],1,"_NotUse",0.4)

asst.AppendRecruit(1, [3, 4, 5], 3, [3, 4, 5], 3, true);
asst.AppendAward(ax);

// asst.StartRecruitCalc(ax,[4,5,6],3,true)
asst.Start(ax);
// eslint-disable-next-line @typescript-eslint/no-empty-function
setInterval(() => {}, 100);
