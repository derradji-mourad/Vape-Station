-- 1. Add missing 'seuil_alerte' column
ALTER TABLE public.produit 
ADD COLUMN IF NOT EXISTS seuil_alerte INTEGER DEFAULT 5;

-- 2. Rename 'prix_achat' to 'cout_achat' to match the frontend code
-- OR if you prefer to keep 'prix_achat', we must update the code.
-- The provided code (ProductWizard.tsx) uses 'cout_achat'.
-- Renaming the column is the safest way to ensure compatibility.
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'produit' AND column_name = 'prix_achat') THEN
    ALTER TABLE public.produit RENAME COLUMN prix_achat TO cout_achat;
  END IF;
END $$;

-- 3. Grant permissions to ensure API access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produit TO anon, authenticated, service_role;
