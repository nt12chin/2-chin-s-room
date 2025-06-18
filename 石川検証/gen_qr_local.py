import qrcode

# ローカルサーバーのURL（例: http://192.168.100.70:8000）
url = 'http://192.168.100.70:8000'

img = qrcode.make(url)
img.save('qrcode_local.png')
print('QRコード画像を保存しました: qrcode_local.png')
