<!--
 * @Author: jing.chen
 * @Date: 2020-04-16 11:24:27
 * @LastEditors: jing.chen
 * @LastEditTime: 2020-04-23 13:52:07
 * @Description: 
 -->
# vscode-plugin-xbb
销帮帮web端国际化插件
公司自用定制化功能

# 功能
1.国际化的推进很多代码阅读性的语言较差，可以用来代码阅读
2.可以用来当辅助工具，检索替换检索校验。用来验证国际化工作是否正确

# 使用方法
$t('first.val1')
 用鼠标选中  **$t('first.val1**  即可
效果如下
![image](https://github.com/chenjing0823/vscode-plugin-xbb/blob/master/img/QQ20200423-132646@2x.png?raw=true)


之所以这样考虑是

有的地方是下面的书写方式
$t('placeholder.choosePls', { attr: '' })
效果如下
![image](https://github.com/chenjing0823/vscode-plugin-xbb/blob/master/img/QQ20200423-132631@2x.png?raw=true)
```
现在取词只要是在&t和结尾引号'即可,
如 test$t('placeholder.choosePls',{attr:''})test
选中 test$t('placeholder.choosePls',{attr: 即可识别，
test$t('first.val1')test
选中test$t('first.val1')test
即：取词只要是在&t和结尾引号'即可,无需上面那么精确
```

# 因为是最近两天用下班时间写的，还有很多优化点。

 
