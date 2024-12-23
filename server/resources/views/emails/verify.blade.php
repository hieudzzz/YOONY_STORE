<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận tài khoản - YonnyStore</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 150px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #f0ba33;
        }
        .cta-button {
            background-color: #ca9729;
            color: #fff;
            text-decoration: none;
            padding: 12px 20px;
            margin-top: 20px;
            border-radius: 5px;
            font-size: 16px;
            text-align: center;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #d7da24;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            margin-top: 30px;
            color: #777;
        }
        .footer a {
            color: #bb9019;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ $message->embed(public_path('img/logo-web-header.png')) }}" alt="YonnyStore Logo">
        </div>

        <div class="content">
            <h1 style="text-align: center">Chào bạn!</h1>
            <p>Chúng tôi rất vui mừng khi bạn gia nhập YonnyStore. Để hoàn tất việc đăng ký, vui lòng nhấn vào liên kết dưới đây để xác minh tài khoản của bạn:</p>

            <a href="{{ $verificationUrl }}" class="cta-button" style="text-align: center">Xác nhận tài khoản</a>

            <p>Liên kết này sẽ hết hạn sau 10 phút kể từ khi bạn nhận được email này.</p>
        </div>

        <div class="footer">
            <p>Thân ái, <br>Đội ngũ YonnyStore</p>
            <p>Đây là email tự động, vui lòng không trả lời email này.</p>
            <p>Tham khảo thêm tại <a href="https://yonnyStore.com">YonnyStore</a></p>
        </div>
    </div>
</body>
</html>
