import type { AiAnalysis } from "@/lib/types";

export const staticDemoInputs = [
  {
    id: "worn-wooden-chair",
    title: "Worn wooden chair",
    category: "Furniture",
    imageUrl: "/demo/chair-input.jpeg",
    analysis: {
      objectName: "Worn wooden dining chair",
      category: "Furniture",
      primaryMaterial: "Solid wood",
      secondaryMaterials: ["Old paint or stain", "Possible glue/fasteners"],
      condition: "fair",
      canReuse: true,
      canDonate: true,
      canSell: true,
      canRepair: true,
      canUpcycle: true,
      canRecycle: false,
      recommendedAction: "repair",
      alternativeActions: ["donate", "sell", "upcycle"],
      confidence: 0.86,
      estimatedResaleValueUsd: 35,
      estimatedRepairCostUsd: 18,
      carbonSavedKg: 9.4,
      landfillAvoidedKg: 6.5,
      disposalSafetyNotes:
        "Before reuse, check chair joints, screws, splinters, and old finish. Sand outdoors or with ventilation if refinishing.",
      reasoning:
        "The selected input image shows a worn wooden chair with cosmetic finish damage but an apparently reusable structure. Repair/refinish preserves the highest material value, while donation or resale keeps the item in use and avoids the carbon cost of replacement.",
      nextSteps: [
        "Tighten joints and inspect cross braces before anyone sits on it.",
        "Sand rough flakes and seal with low-VOC finish for safe reuse.",
        "If you do not need it, photograph it near a window and list it as rustic solid-wood furniture.",
        "If the seat is unstable, upcycle it into a plant stand instead of seating."
      ],
      marketplaceTips: [
        "Mention solid wood, rustic patina, and any repaired joints.",
        "Photograph the chair in natural light with scale context.",
        "Price low enough for pickup: $20-$45 depending on stability."
      ],
      outputIdeas: [
        {
          title: "Repair and refinish",
          action: "repair",
          imageUrl: "/demo/chair-repair-refinish.png",
          carbonSavedKg: 9.4,
          landfillAvoidedKg: 6.5,
          estimatedResaleValueUsd: 45,
          summary: "Sand, tighten, and seal the chair so it can replace buying a new dining or desk chair.",
          details: [
            "Best when the frame is stable and joints can be tightened.",
            "Highest carbon savings because it avoids a replacement purchase.",
            "Good resale angle: refinished solid-wood chair for desk, dining, or accent use."
          ]
        },
        {
          title: "Upcycle as plant stand",
          action: "upcycle",
          imageUrl: "/demo/chair-upcycle-plant-stand.png",
          carbonSavedKg: 6.1,
          landfillAvoidedKg: 6.5,
          estimatedResaleValueUsd: 28,
          summary: "If seating safety is uncertain, convert it into a plant stand or decor piece.",
          details: [
            "Best when the chair is charming but not safe enough for regular seating.",
            "Low effort: clean, paint, seal, and add a stable planter.",
            "Useful for balconies, sunny corners, entryways, or garden rooms."
          ]
        },
        {
          title: "Donate or resell",
          action: "donate",
          imageUrl: "/demo/chair-donate-resale.png",
          carbonSavedKg: 7.2,
          landfillAvoidedKg: 6.5,
          estimatedResaleValueUsd: 35,
          summary: "Clean and stage it for donation, marketplace pickup, or a local reuse group.",
          details: [
            "Best when you do not want to refinish it yourself.",
            "Clean photos and honest condition notes improve pickup success.",
            "Donation preserves utility even when resale value is modest."
          ]
        }
      ]
    } satisfies AiAnalysis
  },
  {
    id: "used-paperback-books",
    title: "Stack of used books",
    category: "Books",
    imageUrl: "/demo/books-input.png",
    analysis: {
      objectName: "Stack of used paperback books",
      category: "Books and media",
      primaryMaterial: "Paper",
      secondaryMaterials: ["Cardboard covers", "Ink", "Bookbinding glue"],
      condition: "good",
      canReuse: true,
      canDonate: true,
      canSell: true,
      canRepair: false,
      canUpcycle: true,
      canRecycle: true,
      recommendedAction: "donate",
      alternativeActions: ["sell", "upcycle", "recycle"],
      confidence: 0.91,
      estimatedResaleValueUsd: 42,
      estimatedRepairCostUsd: 0,
      carbonSavedKg: 5.8,
      landfillAvoidedKg: 4.2,
      disposalSafetyNotes:
        "Keep usable books dry and free of mold before donating or selling. Recycle only books that are badly damaged, wet, or missing pages.",
      reasoning:
        "The selected input image shows a clean stack of recognizable paperback books in good condition. Donation or resale keeps the reading value intact, avoids premature recycling, and helps another household reuse books that still have demand.",
      nextSteps: [
        "Sort the books by condition and remove any with water damage or mold.",
        "Bundle popular titles together for faster marketplace pickup.",
        "Offer readable books to a local library sale, school, community shelf, or neighborhood group.",
        "Recycle only badly damaged paperbacks that cannot reasonably be read or shared."
      ],
      marketplaceTips: [
        "List the stack as a bundle with genre, condition, and pickup location.",
        "Photograph book spines clearly in natural light.",
        "Price common paperbacks as a lot: $25-$45 depending on title mix and condition."
      ],
      outputIdeas: [
        {
          title: "Resell as a bundle",
          action: "sell",
          imageUrl: "/demo/books-resale-bundle.png",
          carbonSavedKg: 5.8,
          landfillAvoidedKg: 4.2,
          estimatedResaleValueUsd: 45,
          summary: "Bundle the readable books together for marketplace pickup or a local used-book buyer.",
          details: [
            "Best when the books are clean, complete, and recognizable titles.",
            "Highest resale value comes from selling the stack as one convenient lot.",
            "Clear spine photos and honest condition notes reduce back-and-forth with buyers."
          ]
        },
        {
          title: "Donate to a community shelf",
          action: "donate",
          imageUrl: "/demo/books-donation-shelf.png",
          carbonSavedKg: 5.1,
          landfillAvoidedKg: 4.2,
          estimatedResaleValueUsd: 0,
          summary: "Place the books in a library sale, school drive, little free library, or neighborhood reuse shelf.",
          details: [
            "Best when you want the fastest low-effort reuse path.",
            "Donation keeps readable books circulating without shipping or packaging.",
            "Good fit for mixed titles that may not be worth listing individually."
          ]
        },
        {
          title: "Style as home decor",
          action: "upcycle",
          imageUrl: "/demo/books-upcycle-decor.png",
          carbonSavedKg: 3.6,
          landfillAvoidedKg: 4.2,
          estimatedResaleValueUsd: 22,
          summary: "Use the stack as a decor riser for a plant, lamp, candle, or styled shelf moment.",
          details: [
            "Best for books you still like visually but do not plan to reread soon.",
            "No cutting or glue is needed, so the books remain readable later.",
            "A styled decor bundle can also be resold to someone furnishing a shelf or coffee table."
          ]
        }
      ]
    } satisfies AiAnalysis
  },
  {
    id: "cracked-laundry-basket",
    title: "Cracked laundry basket",
    category: "Plastic storage",
    imageUrl: "/demo/laundry-basket-input.png",
    analysis: {
      objectName: "Cracked plastic laundry basket",
      category: "Household storage",
      primaryMaterial: "Rigid plastic",
      secondaryMaterials: ["Plastic handles", "Possible polypropylene or HDPE"],
      condition: "poor",
      canReuse: true,
      canDonate: false,
      canSell: false,
      canRepair: true,
      canUpcycle: true,
      canRecycle: true,
      recommendedAction: "upcycle",
      alternativeActions: ["repair", "recycle"],
      confidence: 0.88,
      estimatedResaleValueUsd: 0,
      estimatedRepairCostUsd: 6,
      carbonSavedKg: 3.2,
      landfillAvoidedKg: 1.1,
      disposalSafetyNotes:
        "Do not use the cracked basket for heavy laundry, children, pets, or sharp-edge contact. Tape or trim sharp edges before reuse, and recycle it if the cracks keep spreading.",
      reasoning:
        "The selected input image shows a blue plastic laundry basket with significant cracks and broken rim sections. It is not a good resale or donation candidate, but it can still avoid landfill through light-duty upcycling, careful repair, or responsible plastic recycling.",
      nextSteps: [
        "Check whether the cracked edges are sharp or still spreading.",
        "Use zip ties or tape only for light storage, not heavy laundry loads.",
        "Repurpose it for garden tools, garage rags, sports gear, or other low-stress storage.",
        "If the plastic is brittle or unsafe, clean it and send it to a local rigid-plastic recycling stream where accepted."
      ],
      marketplaceTips: [
        "This item is not a good resale candidate because of the visible cracks.",
        "If giving it away, label it clearly as light-duty storage only.",
        "Offer it free for garden or garage reuse rather than as a laundry basket."
      ],
      outputIdeas: [
        {
          title: "Repair for light storage",
          action: "repair",
          imageUrl: "/demo/laundry-basket-repair.png",
          carbonSavedKg: 3.2,
          landfillAvoidedKg: 1.1,
          estimatedResaleValueUsd: 0,
          summary: "Stabilize the cracks and keep the basket for lightweight towels, rags, or closet storage.",
          details: [
            "Best when the rim still holds shape and the cracks are not sharp.",
            "Use only for light contents so the repaired plastic is not stressed again.",
            "Good carbon savings because it delays buying another plastic storage bin."
          ]
        },
        {
          title: "Upcycle as garden organizer",
          action: "upcycle",
          imageUrl: "/demo/laundry-basket-upcycle.png",
          carbonSavedKg: 2.8,
          landfillAvoidedKg: 1.1,
          estimatedResaleValueUsd: 5,
          summary: "Turn the cracked basket into a low-stress holder for gloves, hand tools, seed packets, or small pots.",
          details: [
            "Best when it is no longer safe for heavy laundry but still stands upright.",
            "Garden or garage use tolerates cosmetic wear better than indoor laundry use.",
            "Keep it away from heavy loads and trim or cover broken plastic edges."
          ]
        },
        {
          title: "Recycle rigid plastic",
          action: "recycle",
          imageUrl: "/demo/laundry-basket-recycle.png",
          carbonSavedKg: 1.4,
          landfillAvoidedKg: 1.1,
          estimatedResaleValueUsd: 0,
          summary: "If the basket is brittle or unsafe, clean it and route it to a rigid-plastic drop-off where accepted.",
          details: [
            "Best when cracks are spreading or sharp edges make reuse unsafe.",
            "Check local rules because bulky rigid plastic is not accepted in every curbside bin.",
            "Remove dirt and loose non-plastic pieces before drop-off."
          ]
        }
      ]
    } satisfies AiAnalysis
  },
  {
    id: "scratched-smartphone",
    title: "Scratched smartphone",
    category: "Electronics",
    imageUrl: "/demo/smartphone-input.png",
    analysis: {
      objectName: "Used smartphone with screen scratches",
      category: "Electronics",
      primaryMaterial: "Glass, aluminum, and electronics",
      secondaryMaterials: ["Lithium-ion battery", "Circuit boards", "Plastic components"],
      condition: "fair",
      canReuse: true,
      canDonate: true,
      canSell: true,
      canRepair: true,
      canUpcycle: false,
      canRecycle: true,
      recommendedAction: "sell",
      alternativeActions: ["repair", "donate", "recycle"],
      confidence: 0.84,
      estimatedResaleValueUsd: 95,
      estimatedRepairCostUsd: 18,
      carbonSavedKg: 52,
      landfillAvoidedKg: 0.19,
      disposalSafetyNotes:
        "Before selling, donating, or recycling a phone, back it up, sign out of accounts, factory reset it, remove SIM/eSIM access, and use certified electronics recycling if the battery is swollen or damaged.",
      reasoning:
        "The selected input image shows a modern smartphone with visible cosmetic scratches but no obvious cracked glass or missing parts. If it powers on, resale or trade-in preserves the most value and avoids the high carbon impact of manufacturing another phone.",
      nextSteps: [
        "Confirm the phone powers on, charges, connects to Wi-Fi, and has no battery swelling.",
        "Back up important data, sign out of accounts, and factory reset before handoff.",
        "Apply a screen protector if scratches are cosmetic and the phone will remain in use.",
        "Use a certified e-waste recycler if the phone does not power on or the battery looks unsafe."
      ],
      marketplaceTips: [
        "List storage size, carrier lock status, battery health, and whether it charges reliably.",
        "Photograph the screen off and on so scratches and display quality are clear.",
        "Price cosmetic-scratch phones below clean-condition comps to avoid disputes."
      ],
      outputIdeas: [
        {
          title: "Resell or trade in",
          action: "sell",
          imageUrl: "/demo/smartphone-resale-tradein.png",
          carbonSavedKg: 52,
          landfillAvoidedKg: 0.19,
          estimatedResaleValueUsd: 120,
          summary: "Clean, reset, and list the phone or route it through a trade-in program if it still works.",
          details: [
            "Best when the phone powers on, charges, and only has cosmetic screen scratches.",
            "Highest impact because keeping electronics in use avoids manufacturing a replacement device.",
            "Clear condition photos and a factory reset are essential before resale."
          ]
        },
        {
          title: "Protect and keep using",
          action: "repair",
          imageUrl: "/demo/smartphone-repair-protect.png",
          carbonSavedKg: 44,
          landfillAvoidedKg: 0.19,
          estimatedResaleValueUsd: 95,
          summary: "Add a screen protector and case so cosmetic scratches do not shorten the phone's useful life.",
          details: [
            "Best when scratches are shallow and the display still works normally.",
            "A low-cost protector can prevent scratches from becoming daily-friction damage.",
            "Keeping the phone another year usually saves more carbon than recycling it early."
          ]
        },
        {
          title: "Certified e-waste recycling",
          action: "recycle",
          imageUrl: "/demo/smartphone-ewaste-recycle.png",
          carbonSavedKg: 9,
          landfillAvoidedKg: 0.19,
          estimatedResaleValueUsd: 0,
          summary: "If the phone is dead or unsafe, wipe data where possible and use a certified electronics recycler.",
          details: [
            "Best when the phone will not power on, cannot be reset, or has battery swelling.",
            "Certified recycling recovers metals and keeps batteries out of household trash.",
            "Remove accessories and memory or SIM cards before drop-off."
          ]
        }
      ]
    } satisfies AiAnalysis
  },
  {
    id: "glass-jam-jar",
    title: "Glass jam jar",
    category: "Kitchen glassware",
    imageUrl: "/demo/glass-jar-input.png",
    analysis: {
      objectName: "Empty glass jam jar with metal lid",
      category: "Kitchen container",
      primaryMaterial: "Clear glass",
      secondaryMaterials: ["Metal lid", "Food-safe lining"],
      condition: "good",
      canReuse: true,
      canDonate: true,
      canSell: false,
      canRepair: false,
      canUpcycle: true,
      canRecycle: true,
      recommendedAction: "reuse",
      alternativeActions: ["upcycle", "donate", "recycle"],
      confidence: 0.93,
      estimatedResaleValueUsd: 1,
      estimatedRepairCostUsd: 0,
      carbonSavedKg: 0.42,
      landfillAvoidedKg: 0.28,
      disposalSafetyNotes:
        "Inspect glass for chips or cracks before reuse. Do not use damaged jars for food storage, and remove food residue before recycling.",
      reasoning:
        "The selected input image shows an intact clear glass jar with a matching metal lid. Reuse is the strongest path because it avoids buying a new container and preserves the jar's full utility before it eventually enters glass recycling.",
      nextSteps: [
        "Wash the jar and lid thoroughly, then remove any sticky label residue.",
        "Check the rim and base for chips before using it for food storage.",
        "Use it for dry pantry goods, leftovers, craft supplies, or cut flowers.",
        "If it is chipped or no longer useful, separate the lid where local recycling rules require it."
      ],
      marketplaceTips: [
        "Single jars usually have little resale value, but a clean set can be useful locally.",
        "Bundle several matching jars for pantry organization or craft reuse.",
        "Offer free pickup if you want fast reuse without listing effort."
      ],
      outputIdeas: [
        {
          title: "Reuse for pantry storage",
          action: "reuse",
          imageUrl: "/demo/glass-jar-pantry-storage.png",
          carbonSavedKg: 0.42,
          landfillAvoidedKg: 0.28,
          estimatedResaleValueUsd: 2,
          summary: "Wash the jar and use it for dry goods, leftovers, spices, hardware, or small household supplies.",
          details: [
            "Best when the glass rim is smooth and the metal lid still seals cleanly.",
            "Highest value path because the jar replaces buying another storage container.",
            "Works well for oats, rice, lentils, tea, buttons, screws, or craft materials."
          ]
        },
        {
          title: "Upcycle as simple decor",
          action: "upcycle",
          imageUrl: "/demo/glass-jar-vase-decor.png",
          carbonSavedKg: 0.31,
          landfillAvoidedKg: 0.28,
          estimatedResaleValueUsd: 3,
          summary: "Turn the jar into a small vase, herb cutting holder, candle holder, or desk organizer.",
          details: [
            "Best when the jar is attractive but you do not need more food storage.",
            "No permanent modification is needed, so it can still be reused later.",
            "A small set of jars can become coordinated shelf, desk, or table decor."
          ]
        },
        {
          title: "Recycle glass and lid",
          action: "recycle",
          imageUrl: "/demo/glass-jar-recycle.png",
          carbonSavedKg: 0.12,
          landfillAvoidedKg: 0.28,
          estimatedResaleValueUsd: 0,
          summary: "If you cannot reuse it, rinse the jar and recycle the glass and metal lid according to local rules.",
          details: [
            "Best when the jar is chipped, missing a usable lid, or surplus after reuse attempts.",
            "Glass recycling keeps mineral material in circulation and avoids landfill weight.",
            "Check whether your area wants the lid attached, loose, or separated into metal recycling."
          ]
        }
      ]
    } satisfies AiAnalysis
  },
  {
    id: "faded-blue-shirt",
    title: "Faded blue shirt",
    category: "Clothing",
    imageUrl: "/demo/faded-shirt-input.png",
    analysis: {
      objectName: "Faded blue cotton shirt",
      category: "Clothing and textiles",
      primaryMaterial: "Cotton knit fabric",
      secondaryMaterials: ["Thread", "Possible dye and elastic collar ribbing"],
      condition: "fair",
      canReuse: true,
      canDonate: true,
      canSell: true,
      canRepair: false,
      canUpcycle: true,
      canRecycle: true,
      recommendedAction: "donate",
      alternativeActions: ["sell", "upcycle", "recycle"],
      confidence: 0.89,
      estimatedResaleValueUsd: 8,
      estimatedRepairCostUsd: 0,
      carbonSavedKg: 6.7,
      landfillAvoidedKg: 0.22,
      disposalSafetyNotes:
        "Donate or sell only clean, dry clothing without strong odors, mold, or heavy stains. Use textile recycling for worn-out fabric that is no longer wearable.",
      reasoning:
        "The selected input image shows a clean folded blue shirt with visible fading but no obvious holes or severe staining. If wearable, donation or low-cost resale keeps the garment in circulation and avoids the resource impact of producing a replacement shirt.",
      nextSteps: [
        "Wash and dry the shirt before donating, selling, or upcycling.",
        "Check seams, underarms, and collar for holes or heavy wear.",
        "If wearable, donate it or bundle it with other basics for resale.",
        "If it is too worn for clothing, cut it into cleaning cloths or route it to textile recycling."
      ],
      marketplaceTips: [
        "List it as a casual faded cotton basic and show the true color in daylight.",
        "Bundle with similar shirts to make pickup worthwhile.",
        "Price modestly: $5-$10 if clean, wearable, and free of holes."
      ],
      outputIdeas: [
        {
          title: "Donate or low-cost resell",
          action: "donate",
          imageUrl: "/demo/faded-shirt-donate-resell.png",
          carbonSavedKg: 6.7,
          landfillAvoidedKg: 0.22,
          estimatedResaleValueUsd: 8,
          summary: "Keep the shirt wearable by donating it or bundling it as a low-cost casual basic.",
          details: [
            "Best when the fabric is clean, soft, and free of holes or heavy stains.",
            "Highest impact because extending clothing life avoids new cotton production.",
            "Bundle with similar basics to make resale or donation more useful."
          ]
        },
        {
          title: "Upcycle into cleaning cloths",
          action: "upcycle",
          imageUrl: "/demo/faded-shirt-cleaning-cloths.png",
          carbonSavedKg: 3.1,
          landfillAvoidedKg: 0.22,
          estimatedResaleValueUsd: 0,
          summary: "Cut the shirt into soft reusable cloths for dusting, wiping counters, or garage cleanup.",
          details: [
            "Best when the shirt is too faded for wearing but still soft and absorbent.",
            "Cotton knit works well as low-lint household cleaning cloths.",
            "This avoids buying disposable wipes or paper towels for simple cleanup."
          ]
        },
        {
          title: "Textile recycling drop-off",
          action: "recycle",
          imageUrl: "/demo/faded-shirt-textile-recycle.png",
          carbonSavedKg: 1.6,
          landfillAvoidedKg: 0.22,
          estimatedResaleValueUsd: 0,
          summary: "If the shirt is worn out, send clean dry fabric to a textile collection program.",
          details: [
            "Best when the shirt has holes, stretched seams, or stains that make donation unlikely.",
            "Textile recycling can turn fabric into wiping rags, insulation, or fiber feedstock.",
            "Keep textiles clean and dry so the whole collection batch is not contaminated."
          ]
        }
      ]
    } satisfies AiAnalysis
  }
];

export function getStaticDemoInput(id: string) {
  return staticDemoInputs.find((input) => input.id === id);
}
