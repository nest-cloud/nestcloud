# 如何部署 Consul

## 单节点部署

把配置文件放到 /etc/consul 目录下，名字任意，例如：/etc/consul/consul.json

```json
{
  "datacenter": "dc1",
  "data_dir": "/usr/lib/consul/data",
  "log_level": "INFO",
  "server": true,
  "bootstrap": true,
  "advertise_addr": "192.168.12.227",
  "client_addr": "0.0.0.0",
  "enable_debug": false,
  "enable_syslog": true,
  "syslog_facility": "local5",
  "ui": true
}
```

```bash
consul agent --config-dir=/etc/consul
```


## 多节点部署

例如有三个节点，IP分别为：192.168.12.227，192.168.12.228，192.168.12.229。

把配置文件放到 /etc/consul 目录下，名字任意，例如：/etc/consul/consul.json

```json
{
  "datacenter": "dc1",
  "data_dir": "/usr/lib/consul/data",
  "log_level": "INFO",
  "server": true,
  "bootstrap_expect": 3,
  "advertise_addr": "{{current_host_ip}}",
  "client_addr": "0.0.0.0",
  "retry_join": ["192.168.12.227","192.168.12.228","192.168.12.229"],
  "retry_interval": "30s",
  "enable_debug": false,
  "rejoin_after_leave": true,
  "start_join": ["192.168.12.227","192.168.12.228","192.168.12.229"],
  "enable_syslog": true,
  "syslog_facility": "local5",
  "ui": true
}
```

```bash
consul agent --config-dir=/etc/consul
```

## 以服务方式运行 Consul (CentOS)

假如 Consul bin 文件位置为：/usr/lib/consul/consul，配置文件位置为：/etc/consul/consul.json


新建服务文件内容如下，放到 /usr/lib/systemd/system/ 下边

```text
[Unit]
Description=consul agent
Requires=network-online.target
After=network-online.target

[Service]
Restart=on-failure
ExecStart=/usr/lib/consul/consul agent -config-dir=/etc/consul
ExecReload=/usr/lib/consul/consul reload
ExecStop=/usr/lib/consul/consul leave
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl start consul
systemctl enable consul
```
