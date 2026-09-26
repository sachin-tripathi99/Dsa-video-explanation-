class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder st = new StringBuilder();              // used as an increasing stack
        for (char c : num.toCharArray()) {
            while (k > 0 && st.length() > 0 && st.charAt(st.length() - 1) > c) {
                st.deleteCharAt(st.length() - 1);           // remove a peak
                k--;
            }
            st.append(c);
        }
        st.setLength(st.length() - k);                       // leftover removals from the end
        int z = 0;
        while (z < st.length() && st.charAt(z) == '0') z++;
        String out = st.substring(z);
        return out.isEmpty() ? "0" : out;
    }
}
