class Solution {
public:
    void reorderList(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
        ListNode *second = slow->next, *prev = nullptr;     // 1. split after the middle
        slow->next = nullptr;
        while (second) {                                    // 2. reverse the second half
            ListNode* nx = second->next;
            second->next = prev;
            prev = second;
            second = nx;
        }
        ListNode *a = head, *b = prev;                      // 3. weave
        while (b) {
            ListNode *an = a->next, *bn = b->next;
            a->next = b;
            b->next = an;
            a = an;
            b = bn;
        }
    }
};
