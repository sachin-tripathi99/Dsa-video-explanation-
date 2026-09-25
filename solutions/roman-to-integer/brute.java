class Solution {
    public int romanToInt(String s) {
        Map<String, Integer> pairs = Map.of("IV", 4, "IX", 9, "XL", 40, "XC", 90, "CD", 400, "CM", 900);
        Map<Character, Integer> single = Map.of('I', 1, 'V', 5, 'X', 10, 'L', 50, 'C', 100, 'D', 500, 'M', 1000);
        int total = 0, i = 0;
        while (i < s.length()) {
            if (i + 1 < s.length() && pairs.containsKey(s.substring(i, i + 2))) {
                total += pairs.get(s.substring(i, i + 2));
                i += 2;
            } else {
                total += single.get(s.charAt(i));
                i += 1;
            }
        }
        return total;
    }
}
