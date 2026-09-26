class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> cnt = new HashMap<>();
        for (char c : s.toCharArray()) cnt.merge(c, 1, Integer::sum);
        List<Character> cs = new ArrayList<>();
        for (char c : s.toCharArray()) cs.add(c);
        cs.sort((a, b) -> !cnt.get(a).equals(cnt.get(b)) ? cnt.get(b) - cnt.get(a) : Character.compare(a, b));
        StringBuilder sb = new StringBuilder();
        for (char c : cs) sb.append(c);
        return sb.toString();
    }
}
