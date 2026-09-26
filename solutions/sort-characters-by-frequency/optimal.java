class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> cnt = new HashMap<>();
        for (char c : s.toCharArray()) cnt.merge(c, 1, Integer::sum);
        List<List<Character>> bucket = new ArrayList<>();
        for (int i = 0; i <= s.length(); i++) bucket.add(new ArrayList<>());
        for (var e : cnt.entrySet()) bucket.get(e.getValue()).add(e.getKey());   // bucket[count]
        StringBuilder sb = new StringBuilder();
        for (int c = s.length(); c >= 1; c--)
            for (char ch : bucket.get(c)) sb.append(String.valueOf(ch).repeat(c));
        return sb.toString();
    }
}
