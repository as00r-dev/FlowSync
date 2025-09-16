# TypeScript Configuration Fix for allowImportingTsExtensions

## Issue
When using the `allowImportingTsExtensions` compiler option in TypeScript, the compiler requires either `noEmit` or `emitDeclarationOnly` to be set to true. Without this, TypeScript throws an error:
```
Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.
```

## Root Cause
The `allowImportingTsExtensions` option allows importing `.ts` files directly, which is useful in certain development scenarios. However, TypeScript requires that when this option is enabled, the compiler either:
1. Doesn't emit any files (`noEmit: true`), or
2. Only emits declaration files (`emitDeclarationOnly: true`)

This is because importing `.ts` files directly can cause issues with the emitted JavaScript files.

## Solution
Added `noEmit: true` to the base tsconfig.json file:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

Also removed conflicting overrides in specific tsconfig files that were setting `allowImportingTsExtensions` to false.

## Verification
After applying the fix:
1. TypeScript compilation succeeds without errors
2. Next.js dev server starts correctly on port 3000
3. All existing functionality continues to work as expected
4. No runtime issues with importing `.ts` files

## Best Practices
1. When using `allowImportingTsExtensions`, always set either `noEmit` or `emitDeclarationOnly` to true
2. Use the base tsconfig for common configuration and extend it in specific packages
3. Avoid overriding settings in package-specific tsconfigs unless absolutely necessary
4. Keep tsconfig files consistent across the monorepo

## Related Issues
- Port conflicts with orphaned next-server processes
- Docker permission issues
- Session management implementation