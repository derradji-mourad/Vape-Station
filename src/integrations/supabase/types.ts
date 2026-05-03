export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admin: {
                Row: {
                    id: string
                    role: string | null
                }
                Insert: {
                    id: string
                    role?: string | null
                }
                Update: {
                    id?: string
                    role?: string | null
                }
                Relationships: []
            }
            clearomiseur: {
                Row: {
                    id_produit: number
                    contenance_ml: number | null
                    embout: string | null
                    remplissage: string | null
                    tirage: Database["public"]["Enums"]["tirage_type"] | null
                    arrivee_air: Database["public"]["Enums"]["arrivee_air_type"] | null
                    airflow_reglable: boolean | null
                    diametre_mm: number | null
                    hauteur_mm: number | null
                    format: string | null
                }
                Insert: {
                    id_produit: number
                    contenance_ml?: number | null
                    embout?: string | null
                    remplissage?: string | null
                    tirage?: Database["public"]["Enums"]["tirage_type"] | null
                    arrivee_air?: Database["public"]["Enums"]["arrivee_air_type"] | null
                    airflow_reglable?: boolean | null
                    diametre_mm?: number | null
                    hauteur_mm?: number | null
                    format?: string | null
                }
                Update: {
                    id_produit?: number
                    contenance_ml?: number | null
                    embout?: string | null
                    remplissage?: string | null
                    tirage?: Database["public"]["Enums"]["tirage_type"] | null
                    arrivee_air?: Database["public"]["Enums"]["arrivee_air_type"] | null
                    airflow_reglable?: boolean | null
                    diametre_mm?: number | null
                    hauteur_mm?: number | null
                    format?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "clearomiseur_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: true
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            clearomiseur_resistance: {
                Row: {
                    id_produit: number
                    id_resistance: number
                }
                Insert: {
                    id_produit: number
                    id_resistance: number
                }
                Update: {
                    id_produit?: number
                    id_resistance?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "clearomiseur_resistance_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: false
                        referencedRelation: "clearomiseur"
                        referencedColumns: ["id_produit"]
                    },
                    {
                        foreignKeyName: "clearomiseur_resistance_id_resistance_fkey"
                        columns: ["id_resistance"]
                        isOneToOne: false
                        referencedRelation: "resistance"
                        referencedColumns: ["id_resistance"]
                    }
                ]
            }
            client: {
                Row: {
                    id_client: string
                    nom: string | null
                    prenom: string | null
                    telephone: string | null
                    adresse: string | null
                    est_majeur: boolean | null
                    carte_identite_url: string
                    id_wilaya: number | null
                }
                Insert: {
                    id_client: string
                    nom?: string | null
                    prenom?: string | null
                    telephone?: string | null
                    adresse?: string | null
                    est_majeur?: boolean | null
                    carte_identite_url: string
                    id_wilaya?: number | null
                }
                Update: {
                    id_client?: string
                    nom?: string | null
                    prenom?: string | null
                    telephone?: string | null
                    adresse?: string | null
                    est_majeur?: boolean | null
                    carte_identite_url?: string
                    id_wilaya?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "client_id_wilaya_fkey"
                        columns: ["id_wilaya"]
                        isOneToOne: false
                        referencedRelation: "wilaya"
                        referencedColumns: ["id_wilaya"]
                    }
                ]
            }
            commande: {
                Row: {
                    id_commande: number
                    id_client: string | null
                    id_panier: number | null
                    statut: Database["public"]["Enums"]["statut_commande"] | null
                    created_at: string | null
                }
                Insert: {
                    id_commande?: number
                    id_client?: string | null
                    id_panier?: number | null
                    statut?: Database["public"]["Enums"]["statut_commande"] | null
                    created_at?: string | null
                }
                Update: {
                    id_commande?: number
                    id_client?: string | null
                    id_panier?: number | null
                    statut?: Database["public"]["Enums"]["statut_commande"] | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "commande_id_client_fkey"
                        columns: ["id_client"]
                        isOneToOne: false
                        referencedRelation: "client"
                        referencedColumns: ["id_client"]
                    },
                    {
                        foreignKeyName: "commande_id_panier_fkey"
                        columns: ["id_panier"]
                        isOneToOne: false
                        referencedRelation: "panier"
                        referencedColumns: ["id_panier"]
                    }
                ]
            }
            compatibilite: {
                Row: {
                    id_vape: number
                    id_accessoire: number
                }
                Insert: {
                    id_vape: number
                    id_accessoire: number
                }
                Update: {
                    id_vape?: number
                    id_accessoire?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "compatibilite_id_accessoire_fkey"
                        columns: ["id_accessoire"]
                        isOneToOne: false
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    },
                    {
                        foreignKeyName: "compatibilite_id_vape_fkey"
                        columns: ["id_vape"]
                        isOneToOne: false
                        referencedRelation: "vape"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            ligne_panier: {
                Row: {
                    id_ligne: number
                    id_panier: number | null
                    id_produit: number | null
                    quantite: number | null
                    prix_unitaire: number | null
                }
                Insert: {
                    id_ligne?: number
                    id_panier?: number | null
                    id_produit?: number | null
                    quantite?: number | null
                    prix_unitaire?: number | null
                }
                Update: {
                    id_ligne?: number
                    id_panier?: number | null
                    id_produit?: number | null
                    quantite?: number | null
                    prix_unitaire?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "ligne_panier_id_panier_fkey"
                        columns: ["id_panier"]
                        isOneToOne: false
                        referencedRelation: "panier"
                        referencedColumns: ["id_panier"]
                    },
                    {
                        foreignKeyName: "ligne_panier_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: false
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            liquide: {
                Row: {
                    id_produit: number
                    volume_ml: number | null
                    taux_nicotine: string | null
                    composition_pgv: string | null
                }
                Insert: {
                    id_produit: number
                    volume_ml?: number | null
                    taux_nicotine?: string | null
                    composition_pgv?: string | null
                }
                Update: {
                    id_produit?: number
                    volume_ml?: number | null
                    taux_nicotine?: string | null
                    composition_pgv?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "liquide_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: true
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            liquide_saveur: {
                Row: {
                    id_produit: number
                    id_saveur: number
                }
                Insert: {
                    id_produit: number
                    id_saveur: number
                }
                Update: {
                    id_produit?: number
                    id_saveur?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "liquide_saveur_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: false
                        referencedRelation: "liquide"
                        referencedColumns: ["id_produit"]
                    },
                    {
                        foreignKeyName: "liquide_saveur_id_saveur_fkey"
                        columns: ["id_saveur"]
                        isOneToOne: false
                        referencedRelation: "saveur"
                        referencedColumns: ["id_saveur"]
                    }
                ]
            }
            livraison: {
                Row: {
                    id_livraison: number
                    id_commande: number | null
                    statut: Database["public"]["Enums"]["statut_livraison"] | null
                }
                Insert: {
                    id_livraison?: number
                    id_commande?: number | null
                    statut?: Database["public"]["Enums"]["statut_livraison"] | null
                }
                Update: {
                    id_livraison?: number
                    id_commande?: number | null
                    statut?: Database["public"]["Enums"]["statut_livraison"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "livraison_id_commande_fkey"
                        columns: ["id_commande"]
                        isOneToOne: false
                        referencedRelation: "commande"
                        referencedColumns: ["id_commande"]
                    }
                ]
            }
            marque: {
                Row: {
                    id_marque: number
                    nom: string
                    logo_path: string
                }
                Insert: {
                    id_marque?: number
                    nom: string
                    logo_path: string
                }
                Update: {
                    id_marque?: number
                    nom?: string
                    logo_path?: string
                }
                Relationships: []
            }
            panier: {
                Row: {
                    id_panier: number
                    id_client: string | null
                    created_at: string | null
                }
                Insert: {
                    id_panier?: number
                    id_client?: string | null
                    created_at?: string | null
                }
                Update: {
                    id_panier?: number
                    id_client?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "panier_id_client_fkey"
                        columns: ["id_client"]
                        isOneToOne: false
                        referencedRelation: "client"
                        referencedColumns: ["id_client"]
                    }
                ]
            }
            produit: {
                Row: {
                    id_produit: number
                    nom: string
                    description: string | null
                    prix: number | null
                    stock: number | null
                    actif: boolean | null
                    image_principale: string
                    created_at: string | null
                }
                Insert: {
                    id_produit?: number
                    nom: string
                    description?: string | null
                    prix?: number | null
                    stock?: number | null
                    actif?: boolean | null
                    image_principale: string
                    created_at?: string | null
                }
                Update: {
                    id_produit?: number
                    nom?: string
                    description?: string | null
                    prix?: number | null
                    stock?: number | null
                    actif?: boolean | null
                    image_principale?: string
                    created_at?: string | null
                }
                Relationships: []
            }
            produit_image: {
                Row: {
                    id_image: number
                    id_produit: number | null
                    image_path: string
                }
                Insert: {
                    id_image?: number
                    id_produit?: number | null
                    image_path: string
                }
                Update: {
                    id_image?: number
                    id_produit?: number | null
                    image_path?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "produit_image_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: false
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            puff: {
                Row: {
                    id_produit: number
                    nombre_bouffees: number | null
                    taux_nicotine: string | null
                    saveur: string | null
                    rechargeable: boolean | null
                }
                Insert: {
                    id_produit: number
                    nombre_bouffees?: number | null
                    taux_nicotine?: string | null
                    saveur?: string | null
                    rechargeable?: boolean | null
                }
                Update: {
                    id_produit?: number
                    nombre_bouffees?: number | null
                    taux_nicotine?: string | null
                    saveur?: string | null
                    rechargeable?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "puff_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: true
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            resistance: {
                Row: {
                    id_resistance: number
                    resistance_ohms: number | null
                    min_wattage: number | null
                    max_wattage: number | null
                    draw: Database["public"]["Enums"]["draw_type"] | null
                    consumption: Database["public"]["Enums"]["consumption_level"] | null
                }
                Insert: {
                    id_resistance?: number
                    resistance_ohms?: number | null
                    min_wattage?: number | null
                    max_wattage?: number | null
                    draw?: Database["public"]["Enums"]["draw_type"] | null
                    consumption?: Database["public"]["Enums"]["consumption_level"] | null
                }
                Update: {
                    id_resistance?: number
                    resistance_ohms?: number | null
                    min_wattage?: number | null
                    max_wattage?: number | null
                    draw?: Database["public"]["Enums"]["draw_type"] | null
                    consumption?: Database["public"]["Enums"]["consumption_level"] | null
                }
                Relationships: []
            }
            saveur: {
                Row: {
                    id_saveur: number
                    nom: string
                }
                Insert: {
                    id_saveur?: number
                    nom: string
                }
                Update: {
                    id_saveur?: number
                    nom?: string
                }
                Relationships: []
            }
            vape: {
                Row: {
                    id_produit: number
                    id_marque: number | null
                    type: Database["public"]["Enums"]["type_vape"] | null
                    puissance_watt: number | null
                    capacite_batterie_mah: number | null
                    capacite_reservoir_ml: number | null
                    airflow_reglable: boolean | null
                    niveau_utilisateur: string | null
                }
                Insert: {
                    id_produit: number
                    id_marque?: number | null
                    type?: Database["public"]["Enums"]["type_vape"] | null
                    puissance_watt?: number | null
                    capacite_batterie_mah?: number | null
                    capacite_reservoir_ml?: number | null
                    airflow_reglable?: boolean | null
                    niveau_utilisateur?: string | null
                }
                Update: {
                    id_produit?: number
                    id_marque?: number | null
                    type?: Database["public"]["Enums"]["type_vape"] | null
                    puissance_watt?: number | null
                    capacite_batterie_mah?: number | null
                    capacite_reservoir_ml?: number | null
                    airflow_reglable?: boolean | null
                    niveau_utilisateur?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "vape_id_marque_fkey"
                        columns: ["id_marque"]
                        isOneToOne: false
                        referencedRelation: "marque"
                        referencedColumns: ["id_marque"]
                    },
                    {
                        foreignKeyName: "vape_id_produit_fkey"
                        columns: ["id_produit"]
                        isOneToOne: true
                        referencedRelation: "produit"
                        referencedColumns: ["id_produit"]
                    }
                ]
            }
            wilaya: {
                Row: {
                    id_wilaya: number
                    nom: string
                }
                Insert: {
                    id_wilaya?: number
                    nom: string
                }
                Update: {
                    id_wilaya?: number
                    nom?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            arrivee_air_type: "bas" | "haut" | "lateral" | "integral"
            consumption_level: "Elevee" | "Moyenne_Elevee" | "Moyenne" | "Moderee"
            draw_type: "Directe" | "Indirecte"
            statut_commande: "En_attente" | "Validee" | "Annulee" | "Terminee"
            statut_livraison: "En_preparation" | "Expediee" | "Livree" | "Annulee"
            tirage_type: "tight" | "restricted" | "smooth" | "smooth_airy" | "airy" | "open"
            type_vape: "Pod" | "Kit" | "Box" | "Stylo"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
