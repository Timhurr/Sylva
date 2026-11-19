/* Bivaska – configuration du serveur (Supabase).
   Laisser vide tant que le projet Supabase n'existe pas : l'appli marche alors entièrement sans compte.
   Seules l'adresse du projet et la clé « anon public » vont ici (elles sont faites pour être publiques,
   la sécurité vient des règles RLS de supabase/schema.sql). Ne JAMAIS mettre la clé « service_role ». */
window.SYLVA_CONFIG = {
  supabaseUrl: "https://zzlewwrakyowuilgqpoj.supabase.co",   // ex. "https://abcdefgh.supabase.co"
  supabaseKey: "sb_publishable_f9Uk0UbzF1R67M55rEOp2w_542DO3uq"    // clé « anon public »
};
