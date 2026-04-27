import { useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SchoolIcon from '@mui/icons-material/School'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { useParents } from '../../hooks/useParents'
import { useDeactivateParent, useActivateParent, useDeleteParent } from '../../hooks/useParentActions'
import { CreateParentModal } from '../../components/CreateParentModal/CreateParentModal'
import { AddStudentModal } from '../../components/AddStudentModal/AddStudentModal'
import type { ParentResponse } from '../../types/parent.types'
import styles from './ParentsListPage.module.scss'

export const ParentsListPage = () => {
  const { data: parents, isLoading } = useParents()
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateParent()
  const { mutate: activate, isPending: isActivating } = useActivateParent()
  const { mutate: deleteParent, isPending: isDeleting } = useDeleteParent()

  const [createParentOpen, setCreateParentOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const initials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Родители</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateParentOpen(true)}
        >
          Нов родител
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      ) : !parents || parents.length === 0 ? (
        <div className={styles.empty}>Няма добавени родители все още.</div>
      ) : (
        <div className={styles.list}>
          {parents.map((parent) => (
            <div key={parent.id} className={`${styles.card} ${!parent.active ? styles.cardInactive : ''}`}>
              <div className={`${styles.avatar} ${!parent.active ? styles.avatarInactive : ''}`}>
                {initials(parent.firstName, parent.lastName)}
              </div>

              <div className={styles.info}>
                <div className={styles.name}>
                  {parent.firstName} {parent.lastName}
                  {!parent.active && (
                    <span className={styles.inactiveBadge}>Деактивиран</span>
                  )}
                </div>
                <div className={styles.email}>{parent.email}</div>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SchoolIcon fontSize="small" />}
                  onClick={() => setSelectedParent(parent)}
                >
                  Добави ученик
                </Button>

                {parent.active ? (
                  <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    startIcon={<BlockIcon fontSize="small" />}
                    disabled={isDeactivating}
                    onClick={() => deactivate(parent.id)}
                  >
                    Деактивирай
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                    disabled={isActivating}
                    onClick={() => activate(parent.id)}
                  >
                    Активирай
                  </Button>
                )}

                {confirmDeleteId === parent.id ? (
                  <div className={styles.deleteConfirm}>
                    <span>Сигурен ли си?</span>
                    <Button size="small" variant="contained" color="error"
                      disabled={isDeleting}
                      onClick={() => deleteParent(parent.id, { onSuccess: () => setConfirmDeleteId(null) })}>
                      Да
                    </Button>
                    <Button size="small" color="inherit" onClick={() => setConfirmDeleteId(null)}>
                      Не
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={() => setConfirmDeleteId(parent.id)}
                  >
                    Изтрий
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateParentModal
        open={createParentOpen}
        onClose={() => setCreateParentOpen(false)}
      />

      {selectedParent && (
        <AddStudentModal
          parent={selectedParent}
          open={true}
          onClose={() => setSelectedParent(null)}
        />
      )}
    </div>
  )
}
