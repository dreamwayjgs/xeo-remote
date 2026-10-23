# Dynaudio Xeo 2

`Dynaudio_Xeo_2.ir`은 IR Blaster Remote에서 가져올 수 있는 Flipper `.ir` 형식의 프로파일입니다. 앱 개발이나 외부 수신기는 필요하지 않습니다.

## 가져오기

1. [Dynaudio_Xeo_2.ir 다운로드](https://raw.githubusercontent.com/dreamwayjgs/xeo-remote/main/Dynaudio_Xeo_2.ir)를 길게 눌러 파일을 폰의 Download 폴더에 저장합니다. 확장자는 `.ir`로 유지합니다.
2. IR Blaster Remote에서 **Settings > Backup > Import backup** 또는 파일 가져오기 메뉴를 엽니다. 설치 버전에 따라 메뉴 이름이 다를 수 있습니다.
3. 파일을 선택하고 가져오기 미리보기에 **17개 버튼**이 나오는지 확인합니다.
4. IR 송신기를 **Internal / 내장 IR**로 선택합니다.
5. 폰 상단을 Xeo 2 수신부로 향하게 하고 **Volume Down**을 짧게 한 번 눌러 확인합니다. 전원이 꺼져 있으면 먼저 Power On을 시도합니다.
6. 각 버튼을 확인합니다. 볼륨 올리기는 짧게 눌러 테스트하고, 길게 누르기 동작은 별도로 확인합니다.
7. 정상 동작하면 앱에서도 백업을 내보내고, 원본 `.ir` 파일과 함께 별도 보관합니다.

## GitHub에서 가져오기

앱의 GitHub 불러오기/GitHub Store에서 아래 저장소 주소를 입력하고 `Dynaudio_Xeo_2.ir`을 선택합니다.

```text
https://github.com/dreamwayjgs/xeo-remote
```

미리보기에 17개 버튼이 나오는지 확인한 뒤 가져옵니다. 위 파일 다운로드 방식으로도 사용할 수 있습니다.

## 출처와 검증 범위

- 공식 코드: https://dynaudio.com/faq/where-do-i-find-the-hex-codes-for-the-xeo-remote-control
- 바이트 표현 참고: https://github.com/Lucaslhm/Flipper-IRDB/blob/main/_Converted_/IR_Plus/D/DYNAUDIO/Xeo5.ir
- 앱 소스의 Flipper 가져오기는 `NECext` 형식을 지원합니다. 설치된 스토어 버전과 최신 소스는 다를 수 있습니다.
- Xeo 2 열의 코드만 사용했습니다. Hub/Connect용 다른 모델의 입력 코드는 포함하지 않았습니다.
- 공식 표가 괄호로 표시한 A/B/C 및 Status LED도 포함했습니다. 이 표기만으로 사용 조건이나 모든 기능의 동작을 보장하지 않습니다.
- 기존 Xeo 5 파일과 공통 버튼의 바이트를 맞췄습니다. 실제 폰 송신·스피커 반응은 아직 검증하지 않았습니다.
