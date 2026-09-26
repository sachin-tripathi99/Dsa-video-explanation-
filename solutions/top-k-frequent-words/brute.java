class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> cnt = new HashMap<>();
        for (String w : words) cnt.merge(w, 1, Integer::sum);
        List<String> keys = new ArrayList<>(cnt.keySet());
        keys.sort((a, b) -> !cnt.get(a).equals(cnt.get(b)) ? cnt.get(b) - cnt.get(a) : a.compareTo(b));
        return keys.subList(0, k);
    }
}
