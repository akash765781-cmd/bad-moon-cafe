import { ShoppingBag } from "lucide-react";
import { PRICE_PLACEHOLDER, type MenuCategory, type MenuItem } from "@/lib/cafe";
import type { OrderItemPayload } from "./OrderModal";

interface MenuCategoryBlockProps {
  category: MenuCategory;
  onOrderItem?: (item: OrderItemPayload) => void;
}

export function MenuCategoryBlock({ category, onOrderItem }: MenuCategoryBlockProps) {
  return (
    <div className="group rounded-2xl border border-caramel/20 bg-[#16110e] p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-caramel/40 hover:bg-[#1a1410]">
      <div className="flex items-baseline justify-between gap-4 border-b border-caramel/30 pb-4">
        <h3 className="font-serif text-2xl font-medium text-white transition-colors group-hover:text-caramel sm:text-3xl">
          {category.title}
        </h3>
        {category.note && (
          <span className="hidden font-script text-2xl text-caramel sm:block">
            {category.note}
          </span>
        )}
      </div>
      <ul className="mt-2 divide-y divide-stone-800/80">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 py-4 transition-all duration-200 hover:translate-x-0.5"
          >
            <div className="pr-2">
              <p className="font-serif text-base font-medium text-stone-100 sm:text-lg">
                {item.name}
              </p>
              {item.description && (
                <p className="mt-1 max-w-md text-xs leading-relaxed text-stone-400">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-serif text-sm font-semibold text-caramel">
                {item.price ?? PRICE_PLACEHOLDER}
              </span>

              {onOrderItem && (
                <button
                  type="button"
                  onClick={() =>
                    onOrderItem({
                      name: item.name,
                      price: item.price || "£3.50",
                      description: item.description || "",
                    })
                  }

                  className="inline-flex items-center gap-1.5 rounded-full border border-caramel/40 bg-caramel/10 px-3 py-1.5 text-xs font-semibold text-caramel transition-all hover:bg-caramel hover:text-espresso active:scale-95 shadow-sm"
                  title={`Order ${item.name}`}
                >
                  <ShoppingBag className="size-3" />
                  <span>Order</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

