<?php

namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

// Mailable để gửi email xác minh
class VerifyEmail extends Mailable
{
    public $verificationUrl;

    public function __construct($verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->view('emails.verify') 
                    ->subject('Xác nhận tài khoản của bạn')
                    ->with([
                        'verificationUrl' => $this->verificationUrl,
                    ]);
    }
}
