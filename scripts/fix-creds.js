import fs from 'fs';

const creds = {
  "type": "service_account",
  "project_id": "samwell-e-rodolf",
  "private_key_id": "4fa5a9f8a936c2d233cb419e4f4ff5a1f159b362",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0rTvgp4Pgw0kn\n8lo0boMJEkowv2szdrHs4xpjonkp8CQ/EmIhqB/0fCHrKoSHBEVMl3gKRJbbw60t\nbdwBYKb2AfZHS6C0a64yPwp7zkJnC3jyQuGFzA4qKlKELQmCoD1KxXZ4RqhC6L3T\ng/aLTftO0BDyTOYOVpKxZYX609h7TA1/oOKXkCcHr+DV9HKindVmqVa1earnKgHl\ndl+s62I4A9uq1hyI6X6DmFQAfLzkSvwkO9EMq8E824UkP64KCRo5/bL2dSdkIIOX\nhgvIw4rvLFSGWSFnXZTkG3yQhIqRnRlM8MubSHC28FaQhRXNuPNLZOJM3h8F6EMB\nL68pm/VrAgMBAAECggEAIuoRFp44eWAzjGEkdlpevwuGQ7pR5H2M74qJaHSWtnh+\nAKQ0S226UxwDz/aE6rR0EdN5cn6Dqo87MXq315pOWV7SsT9XnFXssTAGfhtDMLeC\nVUqAW0Mt/47zKDCt1EzT21WiSabZ0Cg6upuXMp9Mr5O8mp4qnN209kv4opp6jIS3\n0LQV/Q3HAbBTCdpwYs0qtGwCX1dK3EGWa0vKy7y2iWHg2KZgszpW89BD+JRBVLtn\nzZcTAexlpOiJYJe/TqIsob390D6I1+mMaWfcadHp4Y557j9fhgKZnFXSDNUANqIS\nSR2gWV8HobqNiC7Dbwe73Cx6NbtGRNhbGK7eLfduNQKBgQDuA7o45Dgc2DoltM8P\nn1Gqp0set7EkQktFBGGC/G/tti0B7jqcMXoP0U0H7oYKPKkW7TzPpccKcnsGyq+K\n9KmILKpvDaq+arnqMNkxRUsMeZWOe1Bbm0jacH/7lpgA8Y74t+O3ItTD68FqlImV\n4OkcCpsuatIGXZ9UBjwz41D8fQKBgQDCVFWK9l478VsYLlN1r4zH5jw2fQl/7pdt\n75SsWNgmoYGVVQGYV/CYm2hRlOUp/5lQVsPOjb8ihl+ZLmnsrhH0HJ1ZMJ0wibC8\n0SBrqqDwJ0sAcmcGZLGtZ583JEBDVBCn2bWs53rHtqb6PZIhyFerwSPPEQuKWTci\n45We5RymBwKBgGvUnnqF0nIm9/j7OE/QkxQoZJ0PBZ7ytd0XxgGs0hy0yyEzx7PZ\qn4eCbMNOgbLQqPTaRh993XhNaF3FB51B5Vc/v3/CBrqiT3zUYLD7ONC9iGt9lL6\nQABOtXzK1iSfS3GdBfqDOjdkyKS7lLWlRpbgqztVQ7+EjNlpVb8APkGVAoGACAAE\nzYW692jGQUaW9P9XIlueGvgmzfd6kHIOgtHdhCmd9hHb0PO92ep77u/cR1BYdXA8\n+2HmfntdsCazAaVg49XRvHw93GOuvPc3CHerzHcxpUEQcLjwf50GdvStGJh7Xw2d\nZxLYgSRJ1391ZqKiyVVYLgwbl4R4upz36eSwuz0CgYBrH/5x6zjpIurf1Llbq/0T\nOzvzQPpaHgEE+0Bw6Ko6B16cca0I4TFEETOf74/cbFUjZhMA3mcRZ8XOUMRkDNBJ\nQCH97HEzVR9ZZLHyFphAeCyX0Hs5CpdLghVFCIqGx8eStX+LSMqr8B5KXLCkX+9p\nEPH2auNGdGB8HIyZrHRIKw==\n-----END PRIVATE KEY-----\n",
  "client_email": "ocheff@samwell-e-rodolf.iam.gserviceaccount.com",
  "client_id": "101869441410173374075",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ocheff%40samwell-e-rodolf.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

fs.writeFileSync('./google-credentials.json', JSON.stringify(creds, null, 2));
console.log('✅ Arquivo de credenciais corrigido e salvo!');
