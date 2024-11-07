<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'images' => json_decode($this->images, associative: true),
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'is_featured' => $this->is_featured,
            'is_good_deal' => $this->is_good_deal,
            'is_active' => $this->is_active,
            'variants' => VariantResource::collection($this->whenLoaded('variants'))
        ];
    }
}
