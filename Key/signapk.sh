cp /Users/yang/Desktop/directions/platforms/android/build/outputs/apk/android-release-unsigned.apk ./
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore directions.keystore android-release-unsigned.apk directions
~/Library/Android/sdk/build-tools/26.0.1/zipalign -v 4 android-release-unsigned.apk directions.apk
