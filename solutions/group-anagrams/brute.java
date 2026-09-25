class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> groups = new ArrayList<>();
        List<String> keys = new ArrayList<>();               // sorted form of each group's first word
        for (String w : strs) {
            char[] c = w.toCharArray();
            Arrays.sort(c);
            String sorted = new String(c);
            int found = -1;
            for (int g = 0; g < keys.size(); g++) if (keys.get(g).equals(sorted)) { found = g; break; }
            if (found == -1) { keys.add(sorted); groups.add(new ArrayList<>()); found = groups.size() - 1; }
            groups.get(found).add(w);
        }
        return groups;
    }
}
