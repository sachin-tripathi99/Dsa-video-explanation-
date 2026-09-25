class Solution {
    public String predictPartyVictory(String senate) {
        List<Character> s = new ArrayList<>();
        for (char c : senate.toCharArray()) s.add(c);
        while (true) {
            boolean hasR = s.contains('R'), hasD = s.contains('D');
            if (!hasR) return "Dire";
            if (!hasD) return "Radiant";
            for (int i = 0; i < s.size(); i++) {
                char me = s.get(i);
                int j = (i + 1) % s.size();
                while (s.get(j) == me) j = (j + 1) % s.size();   // next opponent after me
                s.remove(j);
                if (j < i) i--;                                  // removal shifted my index
                if (!s.contains(me == 'R' ? 'D' : 'R')) break;
            }
        }
    }
}
