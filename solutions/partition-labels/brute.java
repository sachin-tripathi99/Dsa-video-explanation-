class Solution {
    public List<Integer> partitionLabels(String s) {
        List<Integer> out = new ArrayList<>();
        int n = s.length(), start = 0;
        while (start < n) {
            int end = start;
            for (int i = start; i <= end; i++)              // every char inside the part
                for (int j = n - 1; j > end; j--)           // later copies push the end
                    if (s.charAt(j) == s.charAt(i)) { end = j; break; }
            out.add(end - start + 1);
            start = end + 1;
        }
        return out;
    }
}
