# Dynaudio Xeo 2

IR Blaster Remote에서 가져올 수 있는 Flipper `.ir` 형식의 Dynaudio Xeo 2 프로파일입니다. 앱 개발이나 외부 수신기는 필요하지 않습니다.

## 파일과 확인된 동작

- **`Dynaudio_Xeo_2.ir` — RAW 정본.** 테스트 파일에서 신호를 바꾸지 않고 승격했습니다. POCO X7 Pro와 IR Blaster Remote에서 **전원 켜기·끄기, 볼륨 올리기·내리기**를 사용자가 확인했습니다.
- **`xeo-2-nec.ir` — NEC 형식의 대안.** 같은 17개 명령을 주소·명령으로 저장하고, 파형 생성은 앱에 맡깁니다. **2026-10-24 사용자 보고: POCO X7 Pro와 IR Blaster Remote에서 Bluetooth를 제외한 버튼들이 정상 작동했습니다.** RAW 정본은 유지합니다.
- 실패한 최초 프로파일 내용과 진단·테스트 파일은 현재 목록에서 정리했습니다. 과거 내용은 Git 이력에 남아 있습니다.

두 파일 모두 17개 버튼입니다. **Bluetooth 기능과 길게 누르기·반복 동작은 아직 검증하지 않았습니다.** Bluetooth는 실패 판정이 아니라 미검증입니다. 재생/트랙은 연결·재생 상태가 필요하고 Pairing은 연결 상태를 바꿀 수 있습니다. A/B/C와 Status LED는 공식 표에도 괄호로 표시돼 있으며, 사용자 환경 밖의 모든 구성에서 동작을 보장하지 않습니다.

## RAW와 NEC의 차이

RAW는 38 kHz와 켜짐·꺼짐 시간을 직접 저장합니다. 정본은 탭당 초기 프레임 하나이며, 명시적 반복 프레임은 없습니다. 길게 누를 때 앱이 반복하는지는 별도로 확인해야 합니다.

NEC 파일은 `protocol: NEC`, 논리 주소 `00`, 공식 명령 바이트를 저장합니다. 예를 들어 Volume Down은 `command: 04 00 00 00`입니다. 인코더가 반전 바이트와 LSB-first 전송 순서를 생성하면, 실제 전송 비트열을 MSB-first로 적었을 때 `00FF20DF`가 됩니다. `NECext`로 바꾸거나 RAW용 변환값 `20`을 명령 필드에 직접 넣지 마세요.

검토한 앱 최신 소스는 이 NEC 파일을 정본과 같은 32비트 페이로드로 해석합니다. 다만 앱 NEC 인코더의 기본 주파수는 38,222 Hz, 기본 mark 길이는 562μs로 RAW의 38,000 Hz·560μs와 조금 다릅니다. 파형 전체가 동일한 것은 아닙니다. 사용자 환경에서는 위 범위의 NEC 동작도 확인됐지만, 다른 기기·앱 버전까지 보장하지 않습니다.

## 가져오기

1. [RAW 정본 다운로드](https://raw.githubusercontent.com/dreamwayjgs/xeo-remote/main/Dynaudio_Xeo_2.ir)를 길게 눌러 파일을 폰의 Download 폴더에 저장합니다. 확장자는 `.ir`로 유지합니다. [NEC 대안 파일](https://raw.githubusercontent.com/dreamwayjgs/xeo-remote/main/xeo-2-nec.ir)은 별도로 가져옵니다.
2. IR Blaster Remote에서 **Settings > Backup > Import backup** 또는 파일 가져오기 메뉴를 엽니다. 설치 버전에 따라 메뉴 이름이 다를 수 있습니다.
3. 파일을 선택하고 가져오기 미리보기에 **17개 버튼**이 나오는지 확인합니다.
4. IR 송신기를 **Internal / 내장 IR**로 선택합니다.
5. 폰 상단을 Xeo 2 수신부로 향하게 하고 **Volume Down**을 짧게 한 번 눌러 확인합니다. 전원이 꺼져 있으면 먼저 Power On을 시도합니다.
6. 각 버튼을 확인합니다. 볼륨 올리기는 짧게 눌러 테스트하고, 길게 누르기 동작은 별도로 확인합니다.
7. 정상 동작하면 앱에서도 백업을 내보내고, 원본 `.ir` 파일과 함께 별도 보관합니다.

## GitHub에서 가져오기

앱의 GitHub 불러오기/GitHub Store에서 아래 저장소 주소를 입력하고 **`Dynaudio_Xeo_2.ir`**을 선택합니다. NEC를 비교하려면 **`xeo-2-nec.ir`**을 별도 리모컨으로 가져옵니다.

```text
https://github.com/dreamwayjgs/xeo-remote
```

미리보기에 17개 버튼이 나오는지 확인한 뒤 가져옵니다. 위 파일 다운로드 방식으로도 사용할 수 있습니다.

## 출처와 검증 범위

- 공식 코드: https://dynaudio.com/faq/where-do-i-find-the-hex-codes-for-the-xeo-remote-control
- 앱의 NEC 가져오기 변환: https://github.com/iodn/android-ir-blaster/blob/master/lib/utils/remotes_io.dart (`_convertToLircHex`, `completeNecInverses`)
- 앱의 NEC 파형 생성: https://github.com/iodn/android-ir-blaster/blob/master/lib/ir/protocols/nec.dart
- Xeo 2 열의 코드만 사용했습니다. Hub/Connect용 다른 모델의 입력 코드는 포함하지 않았습니다.
- 공식 표가 괄호로 표시한 A/B/C 및 Status LED도 포함했습니다. 이 표기만으로 사용 조건이나 모든 기능의 동작을 보장하지 않습니다.
- 최초 파일은 자동 변환된 Xeo 5 프로파일의 잘못된 주소·명령 표현을 따랐습니다. 정본은 실제 작동한 RAW 진단 신호를 기준으로 수정했습니다.
