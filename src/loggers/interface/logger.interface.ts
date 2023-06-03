export interface ILogger {
  request: {
    method: string;
    uri: string;
    url: string;
    size: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    querystring: {};
    headers: {
      accept: string;
      host: string;
      'user-agent': string;
    };
  };
  upstream_uri: string;
  response: {
    status: number;
    size: number;
    headers: {
      'Content-Length': string;
      via: string;
      Connection: string;
      'access-control-allow-credentials': boolean;
      'Content-Type': string;
      server: string;
      'access-control-allow-origin': string;
    };
  };
  authenticated_entity: {
    consumer_id: {
      uuid: string;
    };
  };
  route: {
    created_at: number;
    hosts: null;
    id: string;
    methods: string[];
    paths: [string];
    preserve_host: false;
    protocols: string[];
    regex_priority: number;
    service: {
      id: string;
    };
    strip_path: boolean;
    updated_at: number;
  };
  service: {
    connect_timeout: number;
    created_at: number;
    host: string;
    id: string;
    name: string;
    path: string;
    port: number;
    protocol: string;
    read_timeout: number;
    retries: number;
    updated_at: number;
    write_timeout: number;
  };
  latencies: {
    proxy: number;
    gateway: number;
    request: number;
  };
  client_ip: string;
  started_at: number;
}
