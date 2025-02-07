INSERT INTO
    public.regions (id, NAME, deleted)
VALUES
    ('7349bf1f-bf12-412d-a6fc-47533d950a5b', 'Spain', FALSE);

INSERT INTO
    public.plans (
    id,
    NAME,
    description,
    price,
    messages_limit,
    region_id,
    enum_id,
    created_at,
    deleted
)
VALUES
    (
        '3131a73c-6807-494f-91f4-b32fdafa9e22',
        'demo',
        'Demo plan for beta',
        250.00,
        1000,
        '7349bf1f-bf12-412d-a6fc-47533d950a5b', -- Spain region ID
        0,
        NOW(),
        FALSE
    );

INSERT INTO
    public.network (id, NAME, deleted)
VALUES
    ('a31aebaf-9abf-4150-a5ac-8e0f247e77c9', 'whatsapp', FALSE);

-- Insert WhatsApp into all available plans
INSERT INTO
    public.networks_per_plan (id, network_id, plan_id)
VALUES
    (
        '85e0b244-08bb-4f13-b0c9-c328dfa096c7',
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- whatsapp network ID
        '3131a73c-6807-494f-91f4-b32fdafa9e22' -- Demo plan ID
    );

INSERT INTO
    public.currencies (id, NAME, symbol, code, deleted)
VALUES
    (
        0,
        'Euro',
        '€',
        'EUR',
        FALSE
    );