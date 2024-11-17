# EDA Workshop のAWSモジュール作成用 CDK

- env.sh.tempをコピーしてenv.shを作成（適宜修正）
- `env/demo.ts.temp` をコピーして `env/demo.ts` を作成（適宜修正）
- `cdk deploy --all`

ここまで終わったら、Secrets Managerにキーが作成されているので、MomentoのAPI Keyで更新してください。

## CDKで作成されるリソース

- 更新用のS3バケット。ここにファイルを入れると更新が通知される
- EventBridgeのルールとターゲット
- Momento のAPI KEYを保存するためのSecrets Manager

