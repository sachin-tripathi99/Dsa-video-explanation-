class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> out = new ArrayList<>();
        int k = p.length(), n = s.length();
        if (k > n) return out;
        int[] diff = new int[26];                 // window count − p count, per letter
        for (char c : p.toCharArray()) diff[c - 'a']--;
        int matches = 0;
        for (int d : diff) if (d == 0) matches++;
        for (int r = 0; r < n; r++) {
            matches += change(diff, s.charAt(r) - 'a', +1);
            if (r >= k) matches += change(diff, s.charAt(r - k) - 'a', -1);
            if (r >= k - 1 && matches == 26) out.add(r - k + 1);
        }
        return out;
    }

    // Apply delta to one letter and report how the number of matching letters changed.
    private int change(int[] diff, int c, int delta) {
        int before = diff[c] == 0 ? 1 : 0;
        diff[c] += delta;
        int after = diff[c] == 0 ? 1 : 0;
        return after - before;
    }
}
