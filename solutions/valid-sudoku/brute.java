class Solution {
    public boolean isValidSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {                       // rows
            Set<Character> s = new HashSet<>();
            for (int c = 0; c < 9; c++) if (board[r][c] != '.' && !s.add(board[r][c])) return false;
        }
        for (int c = 0; c < 9; c++) {                       // columns
            Set<Character> s = new HashSet<>();
            for (int r = 0; r < 9; r++) if (board[r][c] != '.' && !s.add(board[r][c])) return false;
        }
        for (int b = 0; b < 9; b++) {                       // boxes
            Set<Character> s = new HashSet<>();
            for (int k = 0; k < 9; k++) {
                char d = board[(b / 3) * 3 + k / 3][(b % 3) * 3 + k % 3];
                if (d != '.' && !s.add(d)) return false;
            }
        }
        return true;
    }
}
