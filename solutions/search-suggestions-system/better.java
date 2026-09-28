class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> res = new ArrayList<>();
        for (int i = 1; i <= searchWord.length(); i++) {
            String p = searchWord.substring(0, i);
            int lo = 0, hi = products.length;               // lower_bound(p)
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (products[mid].compareTo(p) < 0) lo = mid + 1;
                else hi = mid;
            }
            List<String> cur = new ArrayList<>();
            for (int k = lo; k < Math.min(lo + 3, products.length) && products[k].startsWith(p); k++) cur.add(products[k]);
            res.add(cur);
        }
        return res;
    }
}
