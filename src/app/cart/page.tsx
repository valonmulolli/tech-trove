'use client';

import { Button } from '@/components/ui/button';
import { PRODUCT_CATEGORIES } from '@/config';
import { useCart } from '@/hooks/use-cart';
import { cn, formatPrice } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const page = () => {
  const { items, removeItem } = useCart();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const fee = 1;

  return (
    <div className='bg-white'>
      {' '}
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Shopping Cart
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:gap-x-16 '>
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            })}
          >
            <h2 className='sr-only'>Items in your Shopping Cart</h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-x-1'>
                <div
                  aria-hidden='true'
                  className='relative mb-4 h-40 w-40 text-muted-foreground'
                >
                  <Image
                    src='/empty-cart.png'
                    alt='cart-empty'
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    loading='eager'
                  />
                </div>
                <h3 className='font-semibold text-2xl'>Your cart is empty</h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Your cart is empty.
                </p>
              </div>
            ) : null}
            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === product.category
                  )?.label;

                  const { image } = product.images[0];

                  return (
                    <li key={product.id} className='flex py-6 sm:py-10'>
                      <div className='flex-shrink-0'>
                        <div className='relative h-24 w-24'>
                          {typeof image !== 'string' && image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt='product image'
                              className='h-full w-full object-cover object-center rounded-md sm:h-48 sm:w-48'
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                        <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                          <div>
                            <div className='flex justify-between'>
                              <h3 className='text-sm'>
                                <Link
                                  href={`/product/${product.id}`}
                                  className='font-medium text-gray-700 hover:text-gray-800'
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className='mt-1 flex text-sm'>
                              <p className='text-muted-foreground'>
                                Category: {label}
                              </p>
                            </div>

                            <p className='mt-1 text-sm font-medium text-gray-900'>
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className='my-4 sm:mt-0 sm:pr-9 w-20'>
                            <div className='absolute top-0 right-0'>
                              <Button
                                aria-label='remove product'
                                variant='destructive'
                                onClick={() => removeItem(product.id)}
                              >
                                <X className='h-4 w-4' aria-hidden />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className='mt-4 flex space-x-2 text-sm text-gray-700'>
                          <Check className='h-4 w-4 text-sky-500' />

                          <span>Eliglible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>Order Summary</h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Subtotal</p>
                <p className='text-sm font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className='animate-spin h-4 w-4 text-muted-foreground' />
                  )}
                </p>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span>Flat transaction fee</span>
                </div>
                <div className='text-sm font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className='animate-spin h-4 w-4 text-muted-foreground' />
                  )}
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>Order Total</div>
                <div className='text-base font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className='animate-spin h-4 w-4 text-muted-foreground' />
                  )}
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <Button className='w-full' size='lg'>Checkout</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
