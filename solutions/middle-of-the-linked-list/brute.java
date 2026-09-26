class Solution {
    public ListNode middleNode(ListNode head) {
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        ListNode p = head;
        for (int i = 0; i < n / 2; i++) p = p.next;
        return p;
    }
}
