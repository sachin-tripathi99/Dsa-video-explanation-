class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> res = new ArrayList<>();
        for (int i = 1; i <= searchWord.length(); i++) {
            String p = searchWord.substring(0, i);
            List<String> cur = new ArrayList<>();
            for (String s : products) {                     // rescan every product
                if (s.startsWith(p)) cur.add(s);
                if (cur.size() == 3) break;
            }
            res.add(cur);
        }
        return res;
    }
}
