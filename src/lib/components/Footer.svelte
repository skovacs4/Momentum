<!-- Footer -->
<footer class="footer">
  <div class="footer-content">
    <p class="footer-text-copy">Momentum &copy; 2024</p>
    <img src="/assets/footer-logo.png" alt="Footer Logo" class="footer-logo" />
    <p class="student-details">Stefan Valentin Kovacs - W20000442</p>
  </div>
</footer>

<style lang="scss">
  footer {
    position: relative;
  }

  .footer-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media screen and (max-width: 475px) {
    .footer-content {
      img {
        opacity: 0.2;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .footer {
      background-color: #313254;
      color: #fff;
      padding: 20px 0;
    }

    .footer-content {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 0px 15px;
      align-items: center;

      .student-details {
        width: 150px;
        text-align: center;
      }

      img {
        opacity: 0.65;
      }
    }

    p {
      font-size: 11px;
    }
  }

  @media screen and (min-width: 769px) {
    .footer {
      background-color: #313254;
      color: #fff;
      padding: 20px 0;
      text-align: center;
      align-items: center;
    }

    .footer-content {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 0px 50px;

      img {
        opacity: 0.65;
      }
    }

    p {
      font-size: 15px;
    }
  }
</style>
